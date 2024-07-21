'use client';

import { Fragment, useEffect, useState } from 'react';
import { Button } from 'antd';
import useLocalStorage from '@/lib/useLocalStorage';
import useNotifications from '@/lib/notification';
import numeral from 'numeral';
import lightBolt11Decoder from 'light-bolt11-decoder';
import { BitvoraClient } from 'bitvora';
import { LoadingOutlined } from '@ant-design/icons';

let bitvora: BitvoraClient;

const satsLimit = 1000;

export default function Page() {
  const { success, error, warning } = useNotifications();

  const [balance, setBalance] = useState(0);
  const [destination, setDestination] = useState('');
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiKeyLoading, setApiKeyLoading] = useState(false);
  const [tab, setTab] = useState('send');
  const [amount, setAmount] = useState(0);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [storedKey, setStoredKey] = useLocalStorage('bit-api-key', '');

  bitvora = new BitvoraClient(storedKey, 'mainnet');

  const loadBalance = async () => {
    const balance = await bitvora.getBalance();
    setBalance(balance);
  };

  const onSave = async (event: any): Promise<void> => {
    event.preventDefault();
    setApiKeyLoading(true);

    try {
      bitvora = new BitvoraClient(apiKey, 'mainnet');
      const balance = await bitvora.getBalance();
      setBalance(balance);
      setStoredKey(apiKey);
      success('Nice! You’re plugged into Bitvora');
    } catch (err) {
      error('Whoops! Invalid Key');
    } finally {
      setApiKeyLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      setBalanceLoading(true);
      await loadBalance();
      setBalanceLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (destination.length > 100) {
      try {
        const ln = lightBolt11Decoder.decode(destination);
        const amountObject = ln?.sections.find((item: any) => item.name === 'amount');
        const amountValue = amountObject ? amountObject.value : undefined;

        const amount = amountValue ? Number(amountValue) / 1000 : 0;

        if (amount > satsLimit) {
          warning('Demo limited to 1000 sat payments');
        } else {
          setAmount(amount);
        }
      } catch (err) {
        setAmount(0);
        error('Invalid lightning invoice');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination]);

  const sendBitcoin = async (event: any) => {
    event.preventDefault();
    setWithdrawalLoading(true);
    try {
      const withdrawal = await bitvora.withdraw(destination, amount);
      // await withdrawal.isSettled();
      await loadBalance();
    } catch (err) {
      error('Error making payment');
    } finally {
      setWithdrawalLoading(false);
    }
    success(`${amount} SATS sent`);
    setDestination('');
    setAmount(0);
  };

  return (
    <Fragment>
      {!storedKey && (
        <div className="w-full">
          <div className="w-full mb-6 pb-6">
            <input
              placeholder="Enter Bitvora API Key"
              className="h-[50px] px-4 py-3 bg-black text-sm outline-none border-light focus:border-light hover:border-light border-[1px] border-opacity-15 hover:border-opacity-15 focus:border-opacity-15 w-full rounded-lg"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
            />
          </div>

          <div className="w-full mt-4 pt-4">
            <Button
              className="w-full font-semibold bg-primary border-primary hover:bg-[#443361] text-sm tracking-[4%] leading-4 rounded-md px-4 py-2 text-white h-12"
              disabled={!apiKey}
              loading={apiKeyLoading}
              onClick={onSave}>
              Save Key
            </Button>
          </div>
        </div>
      )}

      {storedKey && (
        <div className="w-full text-center justify-center px-4">
          {tab === 'send' && (
            <Fragment>
              <p className="text-light">Current Balance</p>
              <div className="flex text-center justify-center text-white">
                {balanceLoading ? (
                  <LoadingOutlined
                    color="inherit"
                    style={{ fontSize: '25px', marginTop: '20px' }}
                  />
                ) : (
                  <p className="text-[40px] text-white font-semibold items-center">
                    {numeral(balance).format('0,0')}
                    <span className="text-light font-light pl-2">SATS</span>
                  </p>
                )}
              </div>

              <div className="w-full relative mt-4 pt-4">
                <input
                  placeholder="Enter Invoice or LN Address"
                  className="h-[50px] pl-4 py-3 pr-[90px] bg-black text-sm outline-none border-light focus:border-light hover:border-light border-[1px] border-opacity-15 hover:border-opacity-15 focus:border-opacity-15 w-full rounded-lg"
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                />

                <div className="bg-[#1e152b] py-2 px-2 rounded-sm absolute top-6 right-2">
                  <p className="text-xs text-light font-light">{amount} SATS</p>
                </div>
              </div>

              <div className="w-full mt-8 pt-8">
                <div className="w-full gap-3 flex items-center mb-2 pb-2">
                  <Button className="w-full font-semibold bg-[#1e152b] border-[#1e152b] hover:bg-[#443361] text-sm tracking-[4%] leading-4 rounded-md px-4 py-2 text-white h-12">
                    Receive
                  </Button>
                  <Button
                    className="w-full font-semibold bg-[#1e152b] border-[#1e152b] hover:bg-[#443361] text-sm tracking-[4%] leading-4 rounded-md px-4 py-2 text-white h-12 disabled:bg-[#1e152b]"
                    onClick={sendBitcoin}
                    loading={withdrawalLoading}
                    disabled={!amount || amount > balance}>
                    Send
                  </Button>
                </div>
                <Button className="w-full font-semibold bg-primary border-primary hover:bg-[#443361] text-sm tracking-[4%] leading-4 rounded-md px-4 py-2 text-white h-12">
                  LN GO BRRR
                </Button>
              </div>
            </Fragment>
          )}
        </div>
      )}
    </Fragment>
  );
}

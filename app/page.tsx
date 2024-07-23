'use client';

import { Fragment, useEffect, useState, useRef } from 'react';
import { Button, QRCode } from 'antd';
import useNotifications from '@/lib/notification';
import numeral from 'numeral';
import lightBolt11Decoder from 'light-bolt11-decoder';
import { BitvoraClient, LightningInvoice } from 'bitvora';
import { LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';

let bitvora: BitvoraClient;

const satsLimit = 1000;
const defaultSatsAmount = 50;
const lnGoBrrrSatsAmount = 21;
const lnGoBrrrCount = 21;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Page() {
  const { success, error, warning, info } = useNotifications();

  const [balance, setBalance] = useState(0);
  const [destination, setDestination] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiKeyLoading, setApiKeyLoading] = useState(false);
  const [tab, setTab] = useState('send');
  const [amount, setAmount] = useState(0);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [storedKey, setStoredKey] = useState('');
  const [lightningInvoice, setLightningInvoice] = useState({} as LightningInvoice);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [lnGoBrrrLoading, setLnGoBrrrLoading] = useState(false);

  const intervalRef = useRef<any>(null);

  const loadBalance = async () => {
    const balance = await bitvora.getBalance();
    setBalance(balance);
  };

  const onSave = async (event: any): Promise<void> => {
    event.preventDefault();
    setApiKeyLoading(true);

    try {
      bitvora = new BitvoraClient(apiKey.trim(), 'mainnet');
      const balance = await bitvora.getBalance();
      setBalance(balance);
      setStoredKey(apiKey.trim());
      success('Nice! You’re plugged into Bitvora');
    } catch (err) {
      error('Whoops! Invalid Key');
    } finally {
      setApiKeyLoading(false);
    }
  };

  useEffect(() => {
    if (destination.length > 100) {
      try {
        const ln = lightBolt11Decoder.decode(destination);
        const amountObject = ln?.sections.find((item: any) => item.name === 'amount');
        const amountValue = amountObject ? amountObject.value : undefined;

        const amount = amountValue ? Number(amountValue) / 1000 : 50;

        if (amount > satsLimit) {
          warning('Demo limited to 1000 sat payments');
        } else {
          setAmount(amount);
        }
      } catch (err) {
        setAmount(0);
        warning('Invalid lightning invoice');
      }
    } else {
      setAmount(defaultSatsAmount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination]);

  const loadLightningInvoice = async () => {
    setInvoiceLoading(true);
    const invoice = await bitvora.createLightningInvoice(
      defaultSatsAmount,
      'Sending to Bitvora API Demo',
      3600,
      null
    );

    //@ts-ignore
    setLightningInvoice(invoice);
    setInvoiceLoading(false);

    await invoice.isSettled();
    await loadBalance();
    success(`${defaultSatsAmount} SATS received`);
    setLightningInvoice({} as LightningInvoice);
    setTab('send');
  };

  useEffect(() => {
    if (tab === 'receive') {
      loadLightningInvoice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const sendBitcoin = async (event: any) => {
    event.preventDefault();

    if (tab === 'receive') {
      setDestination('');
      setAmount(0);
      setTab('send');
      return;
    }

    if (!amount) {
      setAmount(defaultSatsAmount);
    }

    if (amount > balance) {
      warning('Amount more than available balance');
      return;
    }

    const isInvoice = destination.length > 100;

    if (!isInvoice) {
      const isValid = emailRegex.test(destination);

      if (!isValid) {
        warning('Invalid lightning address format');
        return;
      }
    }

    setWithdrawalLoading(true);
    try {
      const withdrawal = await bitvora.withdraw(destination, amount);

      await withdrawal.isSettled();
      await loadBalance();
      success(`${amount} SATS sent`);
    } catch (err: any) {
      error(err?.message);
    } finally {
      setWithdrawalLoading(false);
      setDestination('');
      setAmount(0);
    }
  };

  const copyToClipboard = async (): Promise<void> => {
    window.navigator.clipboard.writeText(lightningInvoice.payment_request);
    info('Invoice copied', 5);
  };

  const pressReceive = (event: any) => {
    event.preventDefault();
    setTab('receive');
  };

  const lnGoBrrr = async () => {
    if (lnGoBrrrLoading) {
      clearInterval(intervalRef.current);
      setLnGoBrrrLoading(false);
      return;
    }

    if (tab === 'receive') {
      setDestination('');
      setAmount(0);
      setTab('send');
      return;
    }

    const isValid = emailRegex.test(destination);
    if (!isValid) {
      warning('Invalid lightning address format');
      return;
    }

    setLnGoBrrrLoading(true);
    let count = 0;

    intervalRef.current = setInterval(async () => {
      try {
        if (lnGoBrrrSatsAmount > balance) {
          warning('Insufficient balance!');
          setLnGoBrrrLoading(false);
          clearInterval(intervalRef.current);
          return;
        }

        if (count >= lnGoBrrrCount) {
          clearInterval(intervalRef.current);
          setLnGoBrrrLoading(false);
          return;
        }

        const withdrawal = await bitvora.withdraw(destination, lnGoBrrrSatsAmount);
        await withdrawal.isSettled();
        success(`${lnGoBrrrSatsAmount} SATS sent: ${count}`, 3);
        await loadBalance();
        count++;
      } catch (err: any) {
        clearInterval(intervalRef.current);
        error(err?.message);
        setLnGoBrrrLoading(false);
      }
    }, 1000);
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
              disabled={apiKey.trim() === ''}
              loading={apiKeyLoading}
              onClick={onSave}>
              Save Key
            </Button>
          </div>
        </div>
      )}

      {storedKey && (
        <div className="w-full text-center justify-center md:px-4">
          {tab === 'send' && (
            <Fragment>
              <p className="text-light">Current Balance</p>
              <div className="flex text-center justify-center text-white">
                <p className="text-[40px] text-white font-semibold items-center">
                  {numeral(balance).format('0,0')}
                  <span className="text-light font-light pl-2">SATS</span>
                </p>
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
            </Fragment>
          )}

          {tab === 'receive' && (
            <div className="w-full text-center justify-center">
              {invoiceLoading ? (
                <div className="text-white flex justify-center items-center">
                  <LoadingOutlined
                    color="inherit"
                    style={{ fontSize: '40px', marginTop: '20px' }}
                  />
                </div>
              ) : (
                <>
                  <div className="w-full text-center justify-center flex">
                    <QRCode
                      errorLevel="H"
                      type="svg"
                      value={lightningInvoice.payment_request}
                      icon="/logo.svg"
                      size={220}
                      bordered={false}
                      color="#EFEDF1"
                      status={invoiceLoading ? 'loading' : 'active'}
                    />
                  </div>

                  <div className="w-full relative mt-4 pt-4">
                    <input
                      placeholder="Enter Invoice or LN Address"
                      className="h-[50px] pl-4 py-3 pr-[110px] bg-black text-sm outline-none border-light focus:border-light hover:border-light border-[1px] border-opacity-15 hover:border-opacity-15 focus:border-opacity-15 w-full rounded-lg"
                      value={lightningInvoice.payment_request}
                      disabled
                    />

                    <div className="bg-[#1e152b] py-2 px-2 rounded-sm absolute top-6 right-2 flex gap-2">
                      <p className="text-xs text-light font-light">
                        <span className="text-white">{defaultSatsAmount}</span> SATS
                      </p>
                      <button onClick={copyToClipboard}>
                        <Image src="/copy.svg" alt="bitcoin" width={16} height={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="w-full mt-4 pt-4 md:mt-8 md:pt-8">
            <div className="w-full gap-3 flex items-center mb-2 pb-2">
              <Button
                className={`w-full font-semibold  hover:bg-[#443361] text-sm tracking-[4%] leading-4 rounded-md px-4 py-2 text-white h-12 ${
                  tab === 'receive'
                    ? 'bg-[#1e152b] border-[#1e152b]'
                    : 'bg-[#1e152b] border-[#1e152b]'
                }`}
                onClick={pressReceive}>
                Receive
              </Button>
              <Button
                className={`w-full font-semibold text-sm tracking-[4%] leading-4 rounded-md px-4 py-2 h-12 disabled:bg-[#1e152b] ${
                  tab === 'receive'
                    ? 'bg-[#0a0910] border-[#0a0910] hover:bg-[#0a0910] text-[#312E36]'
                    : 'bg-[#1e152b] border-[#1e152b] hover:bg-[#443361] text-white'
                }`}
                onClick={sendBitcoin}
                loading={withdrawalLoading}
                disabled={withdrawalLoading}>
                Send
              </Button>
            </div>

            <Button
              className="w-full font-semibold bg-primary border-primary hover:bg-[#443361] text-sm tracking-[4%] leading-4 rounded-md px-4 py-2 text-white h-12 disabled:bg-[#1e152b] disabled:border-[#1e152b]"
              disabled={!destination}
              onClick={lnGoBrrr}>
              {lnGoBrrrLoading && <LoadingOutlined />}
              LN GO BRRR
            </Button>
          </div>
        </div>
      )}
    </Fragment>
  );
}

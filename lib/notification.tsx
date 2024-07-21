import { App } from 'antd';

interface useNotificationInterface {
  info: (content: string) => void;
  success: (content: string) => void;
  error: (content: string) => void;
  warning: (content: string) => void;
}

const useNotifications = (): useNotificationInterface => {
  const duration = 10;
  const { message } = App.useApp();

  const info = (content: string): void => {
    message.open({
      type: 'info',
      content,
      duration
    });
  };

  const success = (content: string): void => {
    message.open({
      type: 'success',
      content,
      duration,
      className: 'w-1/2'
    });
  };

  const error = (content: string): void => {
    message.open({
      type: 'error',
      content,
      duration
    });
  };

  const warning = (content: string): void => {
    message.open({
      type: 'warning',
      content,
      duration
    });
  };

  return {
    info,
    success,
    error,
    warning
  };
};

export default useNotifications;

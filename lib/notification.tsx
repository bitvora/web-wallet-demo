import { App } from 'antd';

interface useNotificationInterface {
  info: (content: string, duration?: number) => void;
  success: (content: string, duration?: number) => void;
  error: (content: string, duration?: number) => void;
  warning: (content: string, duration?: number) => void;
}

const useNotifications = (): useNotificationInterface => {
  const defaultDuration = 10;
  const { message } = App.useApp();

  const info = (content: string, duration = defaultDuration): void => {
    message.open({
      type: 'info',
      content,
      duration
    });
  };

  const success = (content: string, duration = defaultDuration): void => {
    message.open({
      type: 'success',
      content,
      duration,
      className: 'w-1/2'
    });
  };

  const error = (content: string, duration = defaultDuration): void => {
    message.open({
      type: 'error',
      content,
      duration
    });
  };

  const warning = (content: string, duration = defaultDuration): void => {
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

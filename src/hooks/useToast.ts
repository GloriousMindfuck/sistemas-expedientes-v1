import toast from 'react-hot-toast';

export const useToast = () => {
  const success = (message: string) => {
    toast.success(message, {
      style: {
        background: '#10B981',
        color: 'white',
        borderRadius: '8px',
        padding: '12px'
      },
      iconTheme: {
        primary: 'white',
        secondary: '#10B981'
      }
    });
  };

  const error = (message: string) => {
    toast.error(message, {
      style: {
        background: '#EF4444',
        color: 'white',
        borderRadius: '8px',
        padding: '12px'
      },
      iconTheme: {
        primary: 'white',
        secondary: '#EF4444'
      }
    });
  };

  const info = (message: string) => {
    toast(message, {
      style: {
        background: '#3B82F6',
        color: 'white',
        borderRadius: '8px',
        padding: '12px'
      },
      iconTheme: {
        primary: 'white',
        secondary: '#3B82F6'
      }
    });
  };

  return { success, error, info };
};

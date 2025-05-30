import toast from 'react-hot-toast';

export const showSuccess = (message) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
  });
};

export const showError = (message) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
  });
};

export const showLoading = (message) => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

export const showConfirmation = (message, onConfirm, onCancel) => {
  toast((t) => (
    <div className="p-4">
      <p className="mb-4">{message}</p>
      <div className="flex space-x-2">
        <button
          className="btn btn-primary"
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm();
          }}
        >
          Confirm
        </button>
        <button
          className="btn bg-gray-300 hover:bg-gray-400 text-gray-800"
          onClick={() => {
            toast.dismiss(t.id);
            if (onCancel) onCancel();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  ), {
    duration: 10000,
    position: 'top-center',
  });
};

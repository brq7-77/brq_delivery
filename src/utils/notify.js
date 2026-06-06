import toast from "react-hot-toast";

export function notifyPrime(message) {
  toast(message, {
    className: "prime",
    icon: "✦",
  });
}

export function notifySuccess(message) {
  toast.success(message);
}

export function notifyError(message) {
  toast.error(message);
}
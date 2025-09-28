import Swal from "sweetalert2";

export const showSuccess = (message: string) => {
  Swal.fire({
    icon: "success",
    title: "Berhasil!",
    text: message,
    confirmButtonColor: "#111827",
  });
};

export const showError = (message: string) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
    confirmButtonColor: "#DC2626",
  });
};

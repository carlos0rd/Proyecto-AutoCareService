import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
const base = {
  confirmButtonColor: '#2563eb',   // azul Tailwind primary
  cancelButtonColor: '#d33',
  allowOutsideClick: false,
};

/* Diálogos simples */
export const ok    = (title, text = '') =>
  MySwal.fire({ ...base, icon: 'success', title, text });

export const warn  = (title, text = '') =>
  MySwal.fire({ ...base, icon: 'warning', title, text });

export const error = (title, text = '') =>
  MySwal.fire({ ...base, icon: 'error',   title, text });

/* Confirmación: devuelve true/false */
export const confirm = async (title, text = '') => {
  const res = await MySwal.fire({
    ...base,
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'Cancelar',
  });
  return res.isConfirmed;
};

interface propsTypes {
  message: string;
  onClose: any;
}

export const RegistrationSuccess = (props: propsTypes) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="w-1/3 rounded bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-bold">Success!</h2>
        <p className="mb-4">{props.message}</p>
        <button
          onClick={props.onClose}
          className="cursor-pointer rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-2 text-sm transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
};

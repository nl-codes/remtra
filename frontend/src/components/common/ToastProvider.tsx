import { ToastContainer } from "react-toastify";

function ToastProvider() {
    return (
        <ToastContainer
            autoClose={2000}
            closeOnClick
            draggable
            hideProgressBar={true}
            newestOnTop
            pauseOnFocusLoss
            pauseOnHover
            position="top-right"
            theme="dark"
            limit={4}
        />
    );
}

export default ToastProvider;

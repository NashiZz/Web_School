import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onRequestClose, children }) => {
    const [container, setContainer] = useState<Element | null>(null);

    useEffect(() => {
        const modalRoot = document.getElementById("portal-root");
        if (modalRoot) {
            setContainer(modalRoot);
        }
    }, []);

    if (!isOpen || !container) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <button onClick={onRequestClose} className="absolute top-2 right-2">
                    ปิด
                </button>
                {children}
            </div>
        </div>,
        container
    );
};

export default Modal;

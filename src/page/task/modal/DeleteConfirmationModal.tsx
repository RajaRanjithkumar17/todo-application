import { Button, Modal } from "antd"
import axios from "axios";
import { useState } from "react";
import { triggerNotification } from "../../../components/toaster/ToastBar";

interface PopupBlockModalProps {
    open: boolean;
    handlePopupModalClose: () => void;
    taskID: string;
  }

const DeleteConfirmationModal = (props: PopupBlockModalProps) => {
    const {open ,handlePopupModalClose , taskID} = props
    const baseUrl = import.meta.env.VITE_APP_BASE_URL;
    const [loader, setLoader] = useState<boolean>(false);

    const handleDeleteTask = async () =>{
        try {
            const response = await axios.delete(`${baseUrl}/todo/${taskID}`);
            if (response.status === 200) {
            handlePopupModalClose()
              setLoader(false)
            }
          } catch (error) {
            setLoader(false)
            triggerNotification("error", "", "Error while delete data", "topRight");
          }
    }
  return (
     <Modal className="rounded-lg" maskClosable={false} centered open={open} footer={false} onCancel={handlePopupModalClose}>
        <div className="modal-title">
            <h2 className="font-semibold text-[16px] font-Inter pb-2 ">Delete Confirmation</h2>
        </div>
        <div className="modal-body pt-5 ">
            <div className=" w-full ">
                <p className="w-full text-[16px] font-Inter pb-10 ">Are you sure want to delete ?</p>
            </div>
        </div>
        <div className="modal-footer flex justify-end">
         <Button type="primary" onClick={handleDeleteTask} >Delete</Button>
        </div>
    </Modal>
  )
}

export default DeleteConfirmationModal

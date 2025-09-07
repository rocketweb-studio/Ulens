"use client";

import { useRouter } from "next/navigation";
import { Modal } from "@/src/shared/components/Modal/Modal";
import { Button } from "@/src/shared/components/Button/Button";
import { useLogoutMutation } from "@/src/feature/auth/api/authApi";
import { toast } from "react-toastify";
import { Path } from "@/src/shared/components/Navigation/Navigation";
import { useDispatch } from "react-redux";
import { baseApi } from "@/src/app/baseApi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  email: string;
};

export const ConfirmLogout = ({ isOpen, onClose, email }: Props) => {
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleYes = async () => {
    try {
      await logout().unwrap();
      localStorage.removeItem("accessToken");

      dispatch(baseApi.util.resetApiState());

      onClose();
      router.push(Path.SignIn);
    } catch (e) {
      console.error("Logout error:", e);
      toast.error("Something went wrong during Logout");
    }
  };

  const handleNo = () => {
    toast.error(`User with this email doesn't exist`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} modalTitle="Confirm Logout">
      <p>
        Are you really want to log out of your account <b>{email}</b>?
      </p>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <Button variant="primary" onClick={handleYes}>
          Yes
        </Button>
        <Button variant="secondary" onClick={handleNo}>
          No
        </Button>
      </div>
    </Modal>
  );
};

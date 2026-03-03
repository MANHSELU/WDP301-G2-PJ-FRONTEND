import { useState } from "react";
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    type ConfirmationResult,
    type User,
} from "firebase/auth";
import { auth } from "../../util/firebase";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import OtpInput from "otp-input-react";
import { Toaster, toast } from "react-hot-toast";

import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";

/* =====================
   Extend Window for TS
===================== */
declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
        confirmationResult?: ConfirmationResult;
    }
}

const PhoneLogin: React.FC = () => {
    const [otp, setOtp] = useState<string>("");
    const [ph, setPh] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [showOTP, setShowOTP] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    const onCaptchVerify = (): void => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {
                    size: "invisible",
                    callback: () => {
                        onSignup();
                    },
                    "expired-callback": () => { },
                }
            );
        }
    };

    const onSignup = async (): Promise<void> => {
        setLoading(true);
        onCaptchVerify();

        try {
            const appVerifier = window.recaptchaVerifier!;
            const formatPh = "+" + ph;

            const confirmation = await signInWithPhoneNumber(
                auth,
                formatPh,
                appVerifier
            );

            window.confirmationResult = confirmation;
            setShowOTP(true);
            toast.success("OTP sent successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const onOTPVerify = async (): Promise<void> => {
        setLoading(true);

        try {
            const res = await window.confirmationResult!.confirm(otp);
            setUser(res.user);
            toast.success("Login successful!");
        } catch (err) {
            console.error(err);
            toast.error("Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-emerald-500 flex items-center justify-center h-screen">
            <div>
                <Toaster toastOptions={{ duration: 4000 }} />
                <div id="recaptcha-container"></div>

                {user ? (
                    <h2 className="text-center text-white font-medium text-2xl">
                        👍 Login Success
                    </h2>
                ) : (
                    <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
                        <h1 className="text-center leading-normal text-white font-medium text-3xl mb-6">
                            Welcome to <br /> CODE A PROGRAM
                        </h1>

                        {showOTP ? (
                            <>
                                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                                    <BsFillShieldLockFill size={30} />
                                </div>

                                <label className="font-bold text-xl text-white text-center">
                                    Enter your OTP
                                </label>

                                <OtpInput
                                    value={otp}
                                    onChange={setOtp}
                                    OTPLength={6}
                                    otpType="number"
                                    autoFocus
                                    className="opt-container"
                                />

                                <button
                                    onClick={onOTPVerify}
                                    className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                                >
                                    {loading && (
                                        <CgSpinner
                                            size={20}
                                            className="mt-1 animate-spin"
                                        />
                                    )}
                                    <span>Verify OTP</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                                    <BsTelephoneFill size={30} />
                                </div>

                                <label className="font-bold text-xl text-white text-center">
                                    Verify your phone number
                                </label>

                                <PhoneInput
                                    country={"vn"}
                                    value={ph}
                                    onChange={(value) => setPh(value)}
                                />

                                <button
                                    onClick={onSignup}
                                    className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                                >
                                    {loading && (
                                        <CgSpinner
                                            size={20}
                                            className="mt-1 animate-spin"
                                        />
                                    )}
                                    <span>Send code via SMS</span>
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default PhoneLogin;

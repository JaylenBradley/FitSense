import { auth, googleProvider } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

export const createAccount = async (email, password) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
        throw err;
    }
};

export const signIn = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        throw err;
    }
};

export const signInWithGoogle = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (err) {
        throw err;
    }
};
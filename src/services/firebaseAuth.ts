import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, getAdditionalUserInfo, User } from 'firebase/auth';
import { app } from './firebase';
import { GoogleUserProfile } from './googleAuth';

// Real sign-in through Firebase Authentication.
// Google verifies the email address, so it cannot be typed in or faked in the browser.
export const auth = getAuth(app);

export const signInWithGoogle = async (): Promise<GoogleUserProfile> => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  let result;
  try {
    result = await signInWithPopup(auth, provider);
  } catch (err: any) {
    if (err && (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request')) {
      throw new Error('חלון ההתחברות נסגר לפני שההתחברות הושלמה.');
    }
    if (err && err.code === 'auth/popup-blocked') {
      throw new Error('הדפדפן חסם את חלון ההתחברות. יש לאפשר חלונות קופצים לאתר ולנסות שוב.');
    }
    throw new Error('ההתחברות עם Google נכשלה. ניתן לנסות שוב.');
  }

  const user = result.user;
  if (!user.email || !user.emailVerified) {
    await signOut(auth);
    throw new Error('חשבון Google זה אינו כולל כתובת אימייל מאומתת.');
  }

  const info = getAdditionalUserInfo(result);
  let hd: string | undefined = undefined;
  if (info && info.profile && typeof (info.profile as any).hd === 'string') {
    hd = (info.profile as any).hd;
  }

  return {
    email: user.email,
    name: user.displayName || user.email.split('@')[0],
    picture: user.photoURL || undefined,
    hd: hd
  };
};

export const signOutFirebase = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Firebase sign-out error:', err);
  }
};

// Resolves once Firebase has restored (or not) the saved sign-in on page load.
export const waitForAuthUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

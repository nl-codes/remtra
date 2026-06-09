export const profileChangedEvent = "remtra:profile-changed";

export const notifyProfileChanged = (): void => {
    window.dispatchEvent(new Event(profileChangedEvent));
};

/// <reference types="vite/client" />

declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '@emailjs/browser' {
  const init: (userId: string) => void;
  const send: (serviceId: string, templateId: string, templateParams: Record<string, unknown>, userId: string) => Promise<unknown>;
  const sendForm: (serviceId: string, templateId: string, form: HTMLFormElement | string, userId: string) => Promise<unknown>;
  
  export default {
    init,
    send,
    sendForm
  };
}

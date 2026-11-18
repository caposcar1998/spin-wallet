export const flow = {
  user: {
    id: 1,
    name: "Oscar",
    email: "oscar@spin.com",
    balance: 100,
    movements: [
      {
        id: 1,
        description: "Envio a oscar",
        amount: 100,
        date: "2026-02-01",
        extra: "Pago GTA6",
        status: "completed",
      },
      {
        id: 2,
        description: "Envio a Hector",
        amount: 150,
        date: "2026-02-01",
        extra: "Pago Zelda",
        status: "failed",
      },
    ],
  },
  contacts: [
    { id: 1, name: "hector", email: "hector@spin.com" },
    { id: 2, name: "salmay", email: "salmay@spin.com" },
  ],
  loginError: null as string | null,
  loginDelay: 400,
  transactionStatus: "201",
  transactionError: null as string | null,
  transactionDelay: 300,
  onLoginSuccess: undefined as (() => void) | undefined,
  onTransaction: undefined as
    | ((
        status: string,
        data: { cantidad: string; motivo: string; contacto: string },
      ) => void)
    | undefined,
};

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

type User = {
  id: number;
  email: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  phoneNumber?: string;
  bullets?: number;
  pushNotifications?: boolean;
  pickReminders?: boolean;
};

export default User;

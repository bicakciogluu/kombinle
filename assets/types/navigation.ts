export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  CreateAccount: undefined;
  VerifyEmail: {
    fullName: string;
    email: string;
    password: string;
    name: string;
    surname: string;
  };
  Welcome: undefined;
  Styling: undefined;
  Wardrobe: undefined;
  Planner: undefined;
  Explore: undefined;
  Timeline: undefined;
  ClotheAdd: undefined;
  ProfileScreen: {
    userId: number;
  };
  SurveyScreen: undefined;


};

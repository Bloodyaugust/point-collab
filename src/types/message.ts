export enum MessageTypes {
  JOIN,
  POINT,
  HEARTBEAT,
}

export type Message = {
  team: string;
  type: MessageTypes;
  message: object;
  clientID: string;
};

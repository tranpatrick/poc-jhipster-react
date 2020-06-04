import { Moment } from 'moment';
import { IUser } from 'app/shared/model/user.model';

export interface IMessage {
  id?: number;
  content?: string;
  publicationDate?: Moment;
  user?: IUser;
}

export const defaultValue: Readonly<IMessage> = {};

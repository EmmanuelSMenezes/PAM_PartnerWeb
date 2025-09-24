import { INotification, INewNotification } from 'src/@types/communication';
import { apiCommunication } from '../utils/axios';

export const getNotificationsByUserId = async (user_id: string): Promise<INotification[]> => {
  const response = await apiCommunication.get('/notification/listNotificationsByUserId', {
    params: new URLSearchParams([['user_id', user_id]]),
  });
  return response.data.data;
};

export const markAsReadNotification = async (notification_id: string): Promise<INotification> => {
  const response = await apiCommunication.put('/notification/markAsReadNotification', null, {
    params: new URLSearchParams([['notification_id', notification_id]]),
  });
  return response.data.data;
};

export const createNotification = async (
  notification: INewNotification
): Promise<INotification> => {
  const response = await apiCommunication.post('/notification/create', notification);
  return response.data.data;
};

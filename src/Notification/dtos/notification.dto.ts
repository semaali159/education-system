import { NotificationType } from "src/common/enums/notificationType.enum";

export class CreateNotificationDto {
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  sourceType: NotificationType;
  sourceId: number;
}


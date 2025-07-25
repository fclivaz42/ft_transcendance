import { createNotification, NotificationProps } from "../components/notificationDialog";

class NotificationManager {
	public notify(props: NotificationProps) {
		this.closeAll();
		createNotification(props).show();
	}

	public closeAll() {
		document.querySelectorAll("dialog[role='notification']").forEach((dialog) => dialog.remove());
	}
}

export default new NotificationManager();

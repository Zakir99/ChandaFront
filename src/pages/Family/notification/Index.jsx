import MessagePage from "../../../components/body/Message";

const MessageNotificationPage = () => {
  return (
    <main className="px-4 py-5 flex-1 flex flex-col min-h-0">
      <div className="overflow-auto  bg-white dark:bg-gray-900 flex-1 flex flex-col min-h-0">
        <MessagePage url="message/getMessages" showNew={false} />
      </div>
    </main>
  );
};

export default MessageNotificationPage;

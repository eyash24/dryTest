import FeedbackComponent from "../../components/FeedbackForm";
import { UserButton } from "@clerk/nextjs";

export default function Feedback() {
  return (
    <div>
      <div>
        <FeedbackComponent />
      </div>
      <UserButton />
    </div>
  );
}

import { useParams } from "react-router-dom";
import Userprofile from "../components/Userprofile";

function Profile() {
  const { userId } = useParams();

  return (
    <div>
      <Userprofile userId={userId} />
    </div>
  );
}

export default Profile;

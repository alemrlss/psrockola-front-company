import {
  StarIcon,
  EmojiEventsIcon,
  WorkspacePremiumIcon,
} from "@mui/icons-material";

const getIconForMembershipType = (type) => {
  if (type === 10) {
    return {
      name: "Basic",
      icon: <StarIcon />,
      color: "#A4A1A1",
    };
  }
  if (type === 10) {
    return {
      name: "Vip",
      icon: <EmojiEventsIcon />,
      color: "#1294BF",
    };
  }
  if (type === 10) {
    return {
      name: "Premium",
      icon: <WorkspacePremiumIcon />,
      color: "#DEBB03",
    };
  }
};

export default getIconForMembershipType;

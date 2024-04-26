import {
  Star,
  WorkspacePremium,
  EmojiEvents,
  HelpOutline,
} from "@mui/icons-material";

const getIconMembership = (type) => {
  if (type === 10) {
    return {
      icon: (
        <Star
          sx={{
            fontSize: 40,
            color: "#A4A1A1",
          }}
        />
      ),
      color: "#A4A1A1",
    };
  }
  if (type === 20) {
    return {
      icon: (
        <EmojiEvents
          sx={{
            fontSize: 40,
            color: "#1294BF",
          }}
        />
      ),
      color: "#1294BF",
    };
  }
  if (type === 30) {
    return {
      icon: (
        <WorkspacePremium
          sx={{
            fontSize: 40,
            color: "#DEBB03",
          }}
        />
      ),
      color: "#DEBB03",
    };
  }

  return {
    icon: (
      <HelpOutline
        sx={{
          fontSize: 40,
          color: "white",
        }}
      />
    ),
    color: "white",
  };
};

export default getIconMembership;

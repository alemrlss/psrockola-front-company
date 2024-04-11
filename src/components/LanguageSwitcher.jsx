import { useTranslation } from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Flag from "react-world-flags";

const languages = [
  { code: "us", name: "English" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
];

function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleChangeLanguage = (event) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
  };

  return (
    <FormControl>
      <Select
        label="Language"
        value={i18n.language}
        onChange={handleChangeLanguage}
        variant="standard"
        disableUnderline
        sx={{
          "& .MuiSelect-select": {
            backgroundColor: "transparent",
          },
          "& .MuiSelect-icon": {
            color: "black",
          },
          "& .MuiSelect-focus": {
            backgroundColor: "transparent",
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            <div className="flex justify-center items-center">
              <Flag code={lang.code} className="text-gray-800 mx-2 w-8 h-8" />
              <p>{lang.name}</p>
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default LanguageSelector;

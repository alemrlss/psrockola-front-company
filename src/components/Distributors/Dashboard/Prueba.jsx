import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function Prueba({ data }) {
  const { t } = useTranslation();
  // Limitar el número de tarjetas a mostrar
  const maxCardsToShow = 10;
  const cardsToShow = data.slice(0, maxCardsToShow);

  return (
    <div className="container mx-auto px-4 mt-8">
      {data.length !== 0 && (
        <h2 className="text-2xl font-bold mb-4">
         {t("view_dashboard_top_10_reproductions")}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {cardsToShow.map((subcompany, index) => (
          <Card
            key={subcompany.subcompany_id}
            className="bg-gray-100 shadow-lg hover:shadow-xl"
          >
            <CardContent>
              <Typography variant="h6" className="font-bold mb-2">
                {index + 1}. {subcompany.subcompany_name}
              </Typography>
              <Typography variant="body1" className="text-gray-700">
                {t("view_dashboard_reproductions")}: {subcompany.totalreproducciones}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Prueba;

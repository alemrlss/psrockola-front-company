import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

function ReproductionsSubcompany({ data }) {
  // Limitar el número de tarjetas a mostrar
  const maxCardsToShow = 10;
  const cardsToShow = data.slice(0, maxCardsToShow);

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Top Subcompanies</h2>
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
                Reproductions: {subcompany.totalreproducciones}
              </Typography>
            </CardContent>
          </Card>
        ))}
        {/* Rellenar con tarjetas vacías si es necesario */}
        {[...Array(maxCardsToShow - cardsToShow.length)].map((_, index) => (
          <Card
            key={index + cardsToShow.length}
            className="bg-gray-100 shadow-lg"
          >
            <CardContent>
              <Typography variant="h6" className="font-bold mb-2 text-gray-500">
                {index + cardsToShow.length + 1}. No disponible
              </Typography>
              <Typography variant="body1" className="text-gray-700">
                Reproductions: 0
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ReproductionsSubcompany;

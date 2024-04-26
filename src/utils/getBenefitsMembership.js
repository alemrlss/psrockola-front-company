const getBenefitsMembership = (type) => {
  if (type === 10) {
    return {
      sales: "1",
      skins: "1",
      screens: "2",
    };
  }

  if (type === 20) {
    return {
      sales: "3",
      skins: "3",
      screens: "4",
    };
  }

  if (type === 30) {
    return {
      sales: "5",
      skins: "5",
      screens: "6",
    };
  }

  return {
    sales: "0",
    skins: "0",
    screens: "0",
  };
};

export default getBenefitsMembership;

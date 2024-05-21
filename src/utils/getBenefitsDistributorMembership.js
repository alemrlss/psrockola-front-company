const getBenefitsDistributorMembership = (type) => {
  if (type === 5) {
    return {
      accounts: "25",
    };
  }
  if (type === 10) {
    return {
      accounts: "50",
    };
  }

  if (type === 20) {
    return {
      accounts: "100",
    };
  }

  if (type === 30) {
    return {
      accounts: "150",
    };
  }

  if (type === 40) {
    return {
      accounts: "200",
    };
  }
  if (type === 50) {
    return {
      accounts: "500",
    };
  }
  return {
    accounts: "0",
  };
};

export default getBenefitsDistributorMembership;

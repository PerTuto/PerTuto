import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = 'G-H2RGQ50B1T';

export const initGA = () => {
    ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const logEvent = (category: string, action: string, label?: string) => {
    ReactGA.event({
        category,
        action,
        label
    });
};

export const logPageView = () => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};

import React from 'react';
import { AppProps } from 'next/app';
import './styles.css';

const CustomApp = ({ Component, pageProps }: AppProps) => (
	<main>
		<Component {...pageProps} />
	</main>
);

export default CustomApp;

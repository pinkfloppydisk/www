import {Meta, Links, Scripts, usePendingLocation, useMatches} from '@remix-run/react';
import {Outlet} from 'react-router-dom';
import Logo from './components/Logo';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { getColorForSection } from './utils'
import clsx from 'clsx'

import styles from 'css:./styles/shared.css';

export const meta = () => {
	return {
		title: 'Chase McCoy',
		description:
			'Chase McCoy is a product designer, front-end engineer, and internet explorer working on design systems at Stripe.',
		viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
	};
};

export const links = () => {
	return [{rel: 'stylesheet', href: styles}];
};

export default function App() {
	const pendingLocation = usePendingLocation();
	const matches = useMatches()
	const [lastMatch] = matches.slice(-1)
	const section = lastMatch.handle ? lastMatch.handle.section : null
	const sectionColor = getColorForSection(section)
	const sectionBackgroundColor = sectionColor.replace(')', '-background)')
	// const sectionHue = sectionColor.replace('color', 'hue')

	const bodyStyles = {
		'--section-color': sectionColor,
		...(section ? {
				'--color-body-background': sectionBackgroundColor,
				// '--hue': sectionHue
			} : {})
	}

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<Meta />
				<Links />
			</head>
			<body className={clsx(pendingLocation && 'opacity-50')} style={bodyStyles}>
				<div id="wrapper">
					<div>
						<header id="site-header">
							<Logo className="mb-16 mt-8" />
							<Nav />
						</header>

						<main style={{paddingTop: '6px'}}>
							<Outlet />
							<Footer />
						</main>
					</div>
				</div>

				<Scripts />
				{['notes', 'blog'].includes(section) && (
					<script
						async
						src="https://platform.twitter.com/widgets.js"
						charSet="utf-8"
					/>
				)}
			</body>
		</html>
	);
}

export var ErrorBoundary = ({error}) => {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<title>Oops!</title>
			</head>
			<body>
				<div>
					<h1>App Error</h1>
					<pre>{error.message}</pre>
					<p>
						Replace this UI with what you want users to see when your app throws
						uncaught errors. The file is at <code>app/root.tsx</code>.
					</p>
				</div>

				<Scripts />
			</body>
		</html>
	);
};

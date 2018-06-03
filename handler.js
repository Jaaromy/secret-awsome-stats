'use strict';

const https = require('https');

module.exports.downloads = (event, context, callback) => {
	https.get({
			hostname: 'api.github.com',
			path: '/repos/observian/aws-ssm-parameter-manager/releases/latest',
			headers: {
				'User-Agent': 'secret-awsome-stats'
			}
		},
		(res) => {
			let body = [];
			// Do stuff with response
			res.on('data', (d) => {
				body.push(d);
			});

			res.on('end', () => {
				let data = JSON.parse(Buffer.concat(body).toString());

				let retData = {
					total: 0,
					assets: []
				};

				for (let i = 0; i < data.assets.length; i++) {
					const asset = data.assets[i];
					retData.assets.push({
						name: asset.name,
						download_count: asset.download_count
					});
					retData.total += asset.download_count;
				}

				const response = {
					statusCode: 200,
					body: JSON.stringify({
						message: 'Downloads',
						data: retData,
					}),
				};

				callback(null, response);

			});

			res.on('error', err => {
				callback(null, err);
			});
		});



	// Use this code if you don't use the http event with the LAMBDA-PROXY integration
	// callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

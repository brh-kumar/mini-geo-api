# mini-geo-api

<!-- Endpoint	Method	Example	Sample Response	Description -->
<!-- /api/posts	GET	http://reduxblog.herokuapp.com/api/posts -->
| Endpoint | Method | Example | Sample Response | Description |
| --- | --- | --- | --- | --- |
| /api/server/uptime | GET | https://brh-mini-geo-api.herokuapp.com/api/server/uptime | ```  ``` | Fetches the server uptime in Seconds |
| /api/server/logs?from=1528319774582&until=1528319863619&limit=15 | GET | https://brh-mini-geo-api.herokuapp.com/api/server/logs?from=1528319774582&until=1528319863619&limit=50 | ```  ``` | Fetches the server logs between 2 specific timestamps provided in the request. <br />options - <br />&nbsp;&nbsp;&nbsp;from  - `[timestamp] default -24hrs` - Start date <br />&nbsp;&nbsp;&nbsp;until - `[timestamp] default now()` - End date <br />&nbsp;&nbsp;&nbsp;limit - `[number] default 10` - How many records should be fetched <br />&nbsp;&nbsp;&nbsp;order - `[string (desc or asc)] default 'desc'` - Defines the sorting order <br /> |
| /api/geo/:latlng | GET | https://brh-mini-geo-api.herokuapp.com/api/geo/12.903043,77.622921 | ```  ``` | Fetches the list of address associated with the requested coordinates. <br />By default only 10 requests are allowed in an hour, but this default value can be changed by below API (/api/admin/update)
| /api/admin/update | PUT | https://brh-mini-geo-api.herokuapp.com/api/admin/update | ```  ``` | Updates the existing `MAX API CALL LIMIT` to new limit. <br />To perform this operation, you have to pass the admin token as `token = 'AIzaSyASE6fIs9npcWSxYhcYG02WQhG'` at the request header  and in body `{ newMaxApiLimit: $value }`. |

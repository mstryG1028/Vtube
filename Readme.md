-dev dependencies ko hum bas developement phase me hi use karte hai , production me iska use nhi hota isliye install karte time hum npm i -D (depenedency_name) use karte hai
ex:
- nodemon
- prettier -(used for formatting files)

NOTE:
1. if we export as export default xyz --> then we must import xyz from 'xyz';
2. if we export as export {xyz} --> then import {xyz} from 'xyz';

url is:"localhost:8000/api/v1/.."

NOTE:
story between channer and subscriber
- whenever an user subscribe any channel, every time new document will be created which consist 
 a. channel name
 b. subscriber
- whenevr we want to find no of subscriber for any channel we just have to count no of documents which consist that channel name by using aggregation
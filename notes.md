## Database tables
### parent
|Field|Type|Notes
|-|-|-|
|id|integer|
|email|string|
|username|string
|password|string|

### child
|Field|Type|Notes
|-|-|-|
|id|integer|
|name|string


### child
|Field|Type|Notes
|-|-|-|
|id|integer|
|parent_id|integer|references `parent.id`
|child_id|integer|references `child.id`

### audio
|Field|Type|Notes
|-|-|-|
|id|integer|
|child_id|integer|references `child.id`
|time|timestamp
|filename|string
|transcript|string


## UI flow

* Enter
* Login/Register
* Select child
    * Create URL/QR for child
* Select mode
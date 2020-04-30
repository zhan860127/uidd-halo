## Database tables
### parent
|Field|Type|Notes
|-|-|-|
|id|integer|
|email|string|
|username|string
|password|string|
|image_id|integer

### child
|Field|Type|Notes
|-|-|-|
|id|integer|
|name|string
|image_id|integer

### child_audio
|Field|Type|Notes
|-|-|-|
|id|integer|
|child_id|integer|references `child.id`
|time|timestamp
|filename|string
|transcript|string|


### parent_audio
|Field|Type|Notes
|-|-|-|
|id|integer|
|parent_id|integer|
|child_id|integer|references `child.id`
|path|string
|keyword|string


### Image

|Field|Type|Notes
|-|-|-|
|id|integer|
|filepath|string




## UI flow

* Enter
* Login/Register
* Select child
    * Create URL/QR for child
* Select mode
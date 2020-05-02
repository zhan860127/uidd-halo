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

## Website structure

|Path|Description
|-|-|-|
|/|welcome
|/login|Log in
|/signup|Sign up
|/parent| Main menu for parents.
|/parent/children| List of children
|/parent/keywords| Settings for auto response to keywords
|/parent/logs| View audio logs of the child
|/parent/call|Realtime voice chat
|/child|Main page of the child's device. Sends speech fragments to the server. <br> When a parent is in `parent/call`, sends audio stream instead.

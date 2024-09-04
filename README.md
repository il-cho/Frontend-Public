# Git Convention 규칙

| Tag Name | Description                                                           |
| :------: | :-------------------------------------------------------------------- |
|   feat   | 새로운 기능을 추가                                                    |
|  modify  | 기존 개발한 기능 변경                                                 |
|   fix    | 버그 수정                                                             |
|  design  | CSS 등 사용자 UI 디자인 변경                                          |
| refactor | 프로덕션 코드 리팩토링                                                |
| comment  | 필요한 주석 추가 및 변경                                              |
|   docs   | 문서 수정                                                             |
|   test   | 테스트 코드, 리펙토링 테스트 코드 추가,실제로 사용하는 코드 변경 없음 |
|  rename  | 파일 혹은 폴더명을 수정하거나 옮기는 작업만인 경우                    |
|  remove  | 파일을 삭제하는 작업만 수행한 경우                                    |

### 예시

> feat: Mattermost API 연동 기능 추가<br>
> docs: README.md 수정<br>
> fix: Mattermost API KEY 인식 불가 에러 수정<br>

# Branch 전략

서비스 : main<br>
릴리즈 : frontend/domain , backend/domain<br>
개발 : domain/기능명<br>

### feature 브랜치의 경우 반드시 FE / BE 브랜치에서 생성

## Branch 구조

```text
main
|---- develop
    |---- frontend
        |---- landing
    |---- backend
        |---- user
            |---- main
            |---- login
            |---- logout
            |---- join
        |---- invitation
        |---- discovery
        |---- map
        |---- schedule
        |---- chat
        |---- chatbot
```

# Java Package Convention

```text
global
|---- config
|---- util
|---- error
		|---- exceptionhandler
		|---- errorResponse.java
		|---- errorCode.java

domain
|---- controller
    |---- dto
        |---- request
        |---- response
|---- service
     |---- impl
     |---- dto (Optional)
        |---- input
        |---- output
|---- repository
|---- enumeration
|---- entity
```

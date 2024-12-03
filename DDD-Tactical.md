# Domain-Drive Design (Tactical)

### Entities
###### Tem identidade e muda de estado com o passar do tempo

### Value Objects
###### Representam um ou mais valores, são imutáveis e ao serem modificados são reinstaciados

### Domain Service
###### Abstraem regras de negócio que não fazem parte de uma Entity ou Value Object

### Aggregates
###### Relacionamento entre objetos de domínio (Entities, VOs) liderados por uma Aggregate Root (Entity)

### Repositories*
###### Fazem a persistência de aggregates

### Factories
###### Permite a criação de determinado objetos de domínio seguindo algum tipo de critério

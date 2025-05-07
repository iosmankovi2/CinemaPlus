
# CinemaPlus - Informacioni sistem za kino

CinemaPlus je informacioni sistem za upravljanje rezervacijama, prodajom karata, projekcijama i ITIL procesima u okviru kinematografskih operacija. Ovaj sistem omogućava korisnicima da rezervišu i kupe karte, a administratorima da upravljaju filmovima, projekcijama i salama. Takođe, sistem implementira ključne ITIL procese, kao što su **Request Fulfillment**, **Release and Deployment Management**, **Access Management** i **Event Management**.

## Tehnologije

Ovaj projekat koristi sljedeće tehnologije:

- **Frontend**: 
  - **React.js**: Za dinamičko korisničko sučelje.
  - **Axios**: Za komunikaciju sa backendom putem API poziva.

- **Backend**:
  - **Spring Boot**: Za izgradnju REST API-ja i poslovne logike.
  - **Spring Security**: Za implementaciju sigurnosti i autentifikacije korisnika.
  - **Spring Data JPA**: Za rad sa bazom podataka kroz JPA (Java Persistence API).
  - **PostgreSQL**: Relacijska baza podataka za pohranu podataka.
  - **JWT (JSON Web Token)**: Za autentifikaciju i autorizaciju korisnika.
  - **Spring Cloud**: Za centralizovanu konfiguraciju i skalabilnost mikroservisa.

- **Alati**:
  - **Postman**: Za testiranje REST API-ja.
  - **Visual Studio Code**: Za razvoj frontend i backend aplikacija.

## Opis Sistema

CinemaPlus sistem je podijeljen u nekoliko modula koji omogućavaju različite funkcionalnosti:

### 1. **Korisnici**
- **Gost**: Može pregledati filmove, rezervisati ili kupiti karte, ali nema administrativne privilegije.
- **Registrovani korisnik**: Ima pristup naprednijim funkcijama kao što su istorija rezervacija i personalizacija.
- **Administrator**: Ima potpunu kontrolu nad sistemom, uključujući upravljanje filmovima, salama, projekcijama i korisnicima.

### 2. **Filmovima i Projekcijama**
- Administratori mogu dodavati, ažurirati i brisati filmove i projekcije.
- Korisnici mogu pregledati raspored projekcija i rezervisati karte.

### 3. **ITIL Procesi**
- **Request Fulfillment**: Omogućava korisnicima da zatraže dodatne informacije ili pomoć.
- **Release and Deployment Management**: Upravljanje verzijama i implementacijom novih funkcionalnosti.
- **Access Management**: Kontrola pristupa korisnicima i administratorima.
- **Event Management**: Praćenje i upravljanje događanjima i incidentima u sistemu.

## Pokretanje Projekta

### Preusmjeravanje API-ja (Backend)
Backend aplikacija koristi Spring Boot i može se pokrenuti sljedećim komandama:

1. **Preuzimanje projekta**:
    ```bash
    git clone https://github.com/iosmankovi2/CinemaPlus.git
    cd cinema-plus/backend
    ```

2. **Kreiranje baze podataka**:
    - Prije nego što pokrenete aplikaciju, potrebno je postaviti PostgreSQL bazu podataka.
    - Kreirajte bazu podataka sa imenom `kino_system_db` i konfigurirajte fajl `application.properties` u `src/main/resources` sa vašim podacima za pristup bazi.

3. **Pokretanje aplikacije**:
    Ako koristite Maven, možete pokrenuti backend pomoću sljedeće komande:
    ```bash
    ./mvnw spring-boot:run
    ```
### Pokretanje Frontenda
Frontend aplikacija je razvijena u React.js. Da biste je pokrenuli, pratite sljedeće korake:

1. **Preuzimanje projekta**:
    ```bash
       git clone https://github.com/iosmankovi2/CinemaPlus.git
    cd cinema-plus/frontend
    ```

2. **Instalacija zavisnosti**:
    - Pokrenite `npm install` ili `yarn install` za instalaciju svih potrebnih paketa.
    ```bash
    npm install
    ```

3. **Pokretanje aplikacije**:
    - Pokrenite frontend sa sljedećom komandom:
    ```bash
    npm start
    ```

Aplikacija će biti dostupna na [http://localhost:3000](http://localhost:3000).

### Testiranje API-ja
Za testiranje REST API-ja možete koristiti **Postman**:

- **Registracija korisnika**: `POST /api/users/register`
- **Login korisnika**: `POST /api/users/login`
- **Dohvat svih korisnika**: `GET /api/users/all` (samo za administratore)
- **Brisanje korisnika**: `DELETE /api/users/{id}` (samo za administratore)

## ITIL Procesi

Ovaj sistem implementira sljedeće ITIL procese:

1. **Request Fulfillment**:
   - Omogućava korisnicima da šalju zahtjeve za dodatnim informacijama ili podrškom.

2. **Release and Deployment Management**:
   - Upravljanje verzijama sistema, implementacija novih funkcionalnosti i ažuriranja.

3. **Access Management**:
   - Kontrola pristupa korisnicima i administratorima, uključujući autentifikaciju putem JWT-a.

4. **Event Management**:
   - Praćenje i upravljanje događanjima u sistemu, kao što su greške ili promene u sistemu.

## Licenca

Ovaj projekat je licenciran pod [MIT licencom](https://opensource.org/licenses/MIT).

## Autor

CinemaPlus Tim - [Osmanković Ilhana, Gabela Ilhana, Bašić Edna, Hodžić Amna, Pljakić Bakir]

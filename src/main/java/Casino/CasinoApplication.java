package Casino;

import Casino.TicTacToe.TicTacToe;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;


import java.util.*;

@SpringBootApplication
@RestController
public class CasinoApplication{

	private HashMap<String, HttpSession> sessionMap = new HashMap<String, HttpSession>();

	public static void main(String[] args) {
		SpringApplication.run(CasinoApplication.class, args);
	}

	@CrossOrigin(origins = "http://localhost:63342", allowCredentials = "true")
	@GetMapping("/connect")
	public String connect(HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession(true);
		String sessionId = session.getId();
		sessionMap.put(sessionId, session);
		System.out.println("Player Connected with Session ID: "+sessionId);
		return sessionId;
	}

	@CrossOrigin(origins = "http://localhost:63342", allowCredentials = "true")
	@GetMapping("/newGame")
	@ResponseBody
	public String newGame(@RequestParam("gameId") String gameId,
						@RequestParam("size") String size,
						@RequestParam("botDifficulty") String botDifficulty,
						HttpServletRequest request, HttpServletResponse response){
		HttpSession session = request.getSession(true);
		String sessionId = session.getId();
		Enumeration<String> enumeration = session.getAttributeNames();
		System.out.println(session.getAttribute("game"));
		if (session.getAttribute("game")==null) {
			TicTacToe game = new TicTacToe(Long.parseLong(gameId), Integer.parseInt(size), botDifficulty);
			session.setAttribute("game", game);
		} else {
			TicTacToe game = new TicTacToe(Long.parseLong(gameId), Integer.parseInt(size), botDifficulty);
			session.setAttribute("game", game);
			return "Game reset successfully.";
		}
		return "Game created successfully.";
	}

	@CrossOrigin(origins = "http://localhost:63342", allowCredentials = "true")
	@GetMapping("/changePlayers")
	@ResponseBody
	public String changePlayers(@RequestParam("playerCount") Integer playerCount,
								HttpServletRequest request, HttpServletResponse response){
		HttpSession session = request.getSession(true);
		String sessionId = session.getId();
		System.out.println(sessionId);
		TicTacToe game = (TicTacToe) session.getAttribute("game");
		return game.changePlayerCount(playerCount);
	}

	@CrossOrigin(origins = "http://localhost:63342", allowCredentials = "true")
	@GetMapping("/changeDifficulty")
	@ResponseBody
	public String changeDifficulty(@RequestParam("difficulty") String difficulty,
								HttpServletRequest request, HttpServletResponse response){
		HttpSession session = request.getSession(true);
		String sessionId = session.getId();
		TicTacToe game = (TicTacToe) session.getAttribute("game");
		System.out.println(sessionId);
		return game.changeBotDifficulty(difficulty);
	}

	@CrossOrigin(origins = "http://localhost:63342", allowCredentials = "true")
	@GetMapping("/makeMove")
	@ResponseBody
	public Integer makeMove(@RequestParam("position") String position,
							HttpServletRequest request, HttpServletResponse response){
		HttpSession session = request.getSession(true);
		String sessionId = session.getId();
		TicTacToe game = (TicTacToe) session.getAttribute("game");
		System.out.println(sessionId);
		return game.makeMove(Integer.parseInt(position)-1);
	}

	@CrossOrigin(origins = "http://localhost:63342", allowCredentials = "true")
	@GetMapping("/getSessionIDs")
	public Set<String> getSessionIDs(HttpServletRequest request, HttpServletResponse response){
		return sessionMap.keySet();
	}

	@CrossOrigin(origins = "http://localhost:63342", allowCredentials = "true")
	@GetMapping("/getSessionID")
	@ResponseBody
	public String getSessionID(HttpServletRequest request, HttpServletResponse response){
		HttpSession session = request.getSession(true);
		String sessionId = session.getId();
		TicTacToe game = (TicTacToe) session.getAttribute("game");
		System.out.println(sessionId);
		return sessionId;
	}
}

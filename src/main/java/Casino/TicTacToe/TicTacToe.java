package Casino.TicTacToe;

import Casino.CasinoApplication;

import java.util.*;
public class TicTacToe {
    private Long game_id;
    private int[][] Board;
    private int turn;
    private int botDifficulty;
    public TicTacToe(Long gameId, int botDifficulty) {
        this.game_id = gameId;
        this.Board = new int[4][4];
        this.turn = 1;
        this.botDifficulty = botDifficulty;
    }

    public TicTacToe(Long gameId, int size, int botDifficulty) {
        this.game_id = gameId;
        this.Board = new int[size][size];
        this.turn = 1;
        this.botDifficulty = botDifficulty;
    }

    public void printBoard(){
        for (int[] x : this.Board){
            for (int y : x){
                System.out.print(y+" ");
            }
            System.out.println();
        }
    }

    private void incrementTurn(){
        this.turn += 1;
    }

    public int makeMove(int position){
        int[][] board = Board;
        int row = Math.round(position /board.length);
        int col = position % board.length;
        System.out.println(row+" "+col);
        if (board[row][col]==0){
            if (this.turn%2==0){
                board[row][col] = -1;
            } else if (this.turn%2==1) {
                board[row][col] = 1;
            }
            else {
                return -1;
            }
            incrementTurn();
            printBoard();
            return makeBotMove();
        } else {
            return -1;
        }
    }

    public int makeBotMove(){
        switch (this.botDifficulty) {
            case 0:
                return makeEasyBotMove();
            case 1:
                return makeMediumBotMove();
            case 2:
                return makeHardBotMove();
            default:
                return -1;
        }
    }

    private int makeHardBotMove() {
        return -1;
    }

    private int makeMediumBotMove() {
        return -1;
    }

    public int makeEasyBotMove(){
        int[][] board = Board;
        HashSet<Integer> takenSpots = new HashSet<Integer>();
        Random random = new Random();
        while(takenSpots.size()<board.length*board[0].length){
            int move = random.nextInt(0,board.length*board[0].length);
            int row = Math.round(move /board.length);
            int col = move % board.length;
            if (board[row][col]==0){
                if (this.turn%2==0){
                    board[row][col] = -1;
                } else if (this.turn%2==1){
                    board[row][col] = 1;
                }
                else { return -1; }
                incrementTurn();
                printBoard();
                return move+1;
            }
            takenSpots.add(move);
        }
        return -1;
    }

    public Long getGame_id() {
        return game_id;
    }

    public void setGame_id(Long game_id) {
        this.game_id = game_id;
    }

    public int[][] getBoard() {
        return Board;
    }

    public void setBoard(int[][] board) {
        Board = board;
    }
}

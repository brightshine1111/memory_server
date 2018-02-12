defmodule Memory.Game do
  def new do
    %{
      score: 0,
      lastGuess: -1,
      tiles: get_new_tiles(),
      hold: false,
    }
  end

  defp get_new_tiles do
    String.split("A A B B C C D D E E F F G G H H")
    |> Enum.shuffle()
    |> Enum.map(fn (letter) -> %{letter: letter, status: "unmatched"} end) # This is a linked list of maps
  end

  defp select_tile(tile) do
    %{letter: tile.letter, status: "selected"}
  end

  defp unmatch_tile(%{letter: letter, status: "selected"}) do
    %{letter: letter, status: "unmatched"}
  end

  defp unmatch_tile(tile) do
    tile
  end

  defp match_tile(tile) do
    %{letter: tile.letter, status: "matched"}
  end

  # Define game logic
  def guess(game, tile_id) do
    cond do
      game.lastGuess === -1 ->
        # first move
        # update tile status to "selected"
        new_tiles = List.update_at(game.tiles, tile_id, fn(tile) -> select_tile(tile) end)

        %{
          score: game.score + 1,
          lastGuess: tile_id,
          tiles: new_tiles,
          hold: false,
        }
      Enum.at(game.tiles, tile_id).letter === Enum.at(game.tiles, game.lastGuess).letter ->
        # match found
        new_tiles = game.tiles
        |> List.update_at(tile_id, fn(tile) -> match_tile(tile) end)
        |> List.update_at(game.lastGuess, fn(tile) -> match_tile(tile) end) # update both current and last guesses to "matched"
        
        %{
          score: game.score + 1,
          lastGuess: -1,
          tiles: new_tiles,
          hold: false,
        }
      true ->
        # match not found
        new_tiles = List.update_at(game.tiles, tile_id, fn(tile) -> select_tile(tile) end)

        %{
          score: game.score + 1,
          lastGuess: -1,
          tiles: new_tiles,
          hold: true,
        }
    end
  end

  def clear_guess(game) do
    new_tiles = for tile <- game.tiles, do: unmatch_tile(tile)

    %{
      score: game.score,
      lastGuess: -1,
      tiles: new_tiles,
      hold: false,
    }
  end
end
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

  defp match_tile(tile) do
    %{letter: tile.letter, status: "matched"}
  end

  # Define game logic
  def guess(game, tile_id) do
    if game.lastGuess === -1 do
      # first move
      # update tile status to "selected"
      new_tiles = List.update_at(game.tiles, tile_id, fn(tile) -> select_tile(tile) end)

      %{
        score: game.score + 1,
        lastGuess: tile_id,
        tiles: new_tiles,
        hold: false,
      }
    else if Enum.at(game.tiles, tile_id).letter === Enum.at(game.tiles, game.lastGuess).letter do
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
    else
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
  end
end
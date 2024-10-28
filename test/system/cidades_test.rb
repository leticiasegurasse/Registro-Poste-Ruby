require "application_system_test_case"

class CidadesTest < ApplicationSystemTestCase
  setup do
    @cidade = cidades(:one)
  end

  test "visiting the index" do
    visit cidades_url
    assert_selector "h1", text: "Cidades"
  end

  test "should create cidade" do
    visit cidades_url
    click_on "New cidade"

    fill_in "Nome", with: @cidade.nome
    click_on "Create Cidade"

    assert_text "Cidade was successfully created"
    click_on "Back"
  end

  test "should update Cidade" do
    visit cidade_url(@cidade)
    click_on "Edit this cidade", match: :first

    fill_in "Nome", with: @cidade.nome
    click_on "Update Cidade"

    assert_text "Cidade was successfully updated"
    click_on "Back"
  end

  test "should destroy Cidade" do
    visit cidade_url(@cidade)
    click_on "Destroy this cidade", match: :first

    assert_text "Cidade was successfully destroyed"
  end
end

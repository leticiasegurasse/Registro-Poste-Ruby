require "application_system_test_case"

class BairrosTest < ApplicationSystemTestCase
  setup do
    @bairro = bairros(:one)
  end

  test "visiting the index" do
    visit bairros_url
    assert_selector "h1", text: "Bairros"
  end

  test "should create bairro" do
    visit bairros_url
    click_on "New bairro"

    fill_in "Cidade", with: @bairro.cidade_id
    fill_in "Nome", with: @bairro.nome
    click_on "Create Bairro"

    assert_text "Bairro was successfully created"
    click_on "Back"
  end

  test "should update Bairro" do
    visit bairro_url(@bairro)
    click_on "Edit this bairro", match: :first

    fill_in "Cidade", with: @bairro.cidade_id
    fill_in "Nome", with: @bairro.nome
    click_on "Update Bairro"

    assert_text "Bairro was successfully updated"
    click_on "Back"
  end

  test "should destroy Bairro" do
    visit bairro_url(@bairro)
    click_on "Destroy this bairro", match: :first

    assert_text "Bairro was successfully destroyed"
  end
end
